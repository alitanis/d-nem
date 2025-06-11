import Parser from "rss-parser";
import Post from "../models/post.model.js";

const parser = new Parser();

const RSS_FEED_URL = "https://www.hurriyet.com.tr/rss/anasayfa";

export const fetchAndSaveRSS = async () => {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);

    for (const item of feed.items) {
      const existingPost = await Post.findOne({ slug: item.link });

      if (!existingPost) {
        const newPost = new Post({
          title: item.title,
          content: item.contentSnippet || item.content || "",
          image: item.enclosure?.url || "https://via.placeholder.com/600x400", // varsa resim
          slug: item.link,
          category: "worldnews", // varsayılan bir kategori
        });

        await newPost.save();
        console.log(`✓ Yeni haber eklendi: ${item.title}`);
      }
    }
  } catch (error) {
    console.error("RSS çekme hatası:", error.message);
  }
};
