const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "https://sheryyll-blog-app2.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow mobile/curl

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MongoDB URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

  const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const BlogPost = mongoose.model("BlogPost", blogPostSchema);


// GET all posts (optional tag filter)
app.get("/api/posts", async (req, res) => {
  try {
    const { tag } = req.query;
    const query = tag ? { tags: { $in: [tag] } } : {};

    const posts = await BlogPost.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    let processedTags = [];
    if (tags) {
      processedTags = Array.isArray(tags)
        ? tags.map((t) => t.trim()).filter(Boolean)
        : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const newPost = new BlogPost({ title, content, author, tags: processedTags });
    const saved = await newPost.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    let processedTags = [];
    if (tags) {
      processedTags = Array.isArray(tags)
        ? tags.map((t) => t.trim()).filter(Boolean)
        : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const updated = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, author, tags: processedTags },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Post not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deleted = await BlogPost.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "Post not found" });

    res.json({ message: "Deleted successfully", post: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
