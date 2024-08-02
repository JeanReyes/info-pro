import { defineCollection, z } from "astro:content";

const docsCollection = defineCollection({
  type: "content",
  schema: ({image}) =>
    z.object({
      title: z.string(),
      author: z.string(),
      description: z.string(),
      image: image()
    }),
});

export const collections = {
  doc: docsCollection,
};
