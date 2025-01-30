import Post from "../modals/posts.js";
import Alumni from "../modals/alumni.modal.js";
import cloudinary from "../config/cloudinary.js";  // Assuming cloudinary configuration is in this path

// Create a post
export const createPost = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts_images",  // Optionally specify folder in Cloudinary
      });
      imageUrl = result.secure_url;  // Cloudinary URL of the uploaded image
    }

    // Create post with the provided body and optional image
    const post = new Post({
      ...req.body,
      alumni_user_id: req.body.alumni_user_id, // Ensure alumni_user_id is passed in request
      image: imageUrl, // Store Cloudinary URL instead of local path
    });

    // Save the post
    await post.save();

    // Update the alumni's posts field with the new post reference
    await Alumni.findByIdAndUpdate(req.body.alumni_user_id, {
      $push: { posts: post._id } // Add the post to alumni's posts
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    // Populate the alumni_user_id reference to get full alumni details for each post
    const posts = await Post.find()
      .populate('alumni_user_id') // Populating the alumni reference to fetch alumni details
      .exec();  // Execute the query to populate correctly
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get posts by a specific alumni
export const getPostsByAlumni = async (req, res) => {
  try {
    const posts = await Post.find({ alumni_user_id: req.params.alumniId })
      .populate('alumni_user_id'); // Populate alumni reference for each post
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    // Handle image update (if new image is uploaded)
    let imageUrl = req.body.image;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts_images",
      });
      imageUrl = result.secure_url;
    }

    // Update the post and ensure it's populated with the alumni reference
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      ...req.body,
      image: imageUrl,  // Update image if it is provided
    }, { new: true })
      .populate('alumni_user_id');  // Populate alumni reference after update

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove the post from alumni's posts field
    await Alumni.findByIdAndUpdate(post.alumni_user_id, {
      $pull: { posts: post._id } // Remove the post reference from alumni's posts
    });

    // Optionally, delete image from Cloudinary (if it exists)
    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0]; // Extract public ID
      await cloudinary.uploader.destroy(publicId);  // Delete image from Cloudinary
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
