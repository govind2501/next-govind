import { MetadataRoute } from "next";
import { connect } from "@/dbConfig/dbConfig";
import Property from "@/models/propertymodels";

const BASE_URL = "https://trademyproperty.co.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connect();

  // Only include approved, publicly visible properties
  const properties = await Property.find({ status: "Approved" }).select("_id updatedAt");

  const propertyUrls: MetadataRoute.Sitemap = properties.map((prop) => ({
    url: `${BASE_URL}/property/${prop._id}`,
    lastModified: prop.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Static, publicly visible pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/property`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...propertyUrls];
}