import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {};
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Query 
    const query = req.body.query;
    const apiKey = req.body.apiKey;
    process.env.OPENAI_API_KEY = apiKey;

    // Vector DB 
      const pinecone = new PineconeClient();
      await pinecone.init({
        environment: "us-east1-gcp", 
        apiKey: process.env.PINECONE_API_KEY ?? "",
      });
      const index = pinecone.Index("lex-gpt");
      const vectorStore = await PineconeStore.fromExistingIndex(
        index,
        new OpenAIEmbeddings()
      );

      // Return chunks to display as references 
      const results = await vectorStore.similaritySearch(query, 4);
      res.status(200).send(results); 
    }

export default handler;