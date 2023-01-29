import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const s3 = new S3({
    region: process.env.REGION,
    apiVersion: "2006-03-01",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  try {
    const post = s3.createPresignedPost({
      Bucket: process.env.BUCKET_NAME,
      Fields: {
        key: `images/${req.query.file}`,
        "Content-Type": req.query.fileType,
      },
      Expires: 60, // seconds
      Conditions: [
        ["content-length-range", 0, 1048576], // up to 1 MB
      ],
    });
    console.log("post", post);
    res.status(200).json(post);
  } catch (error) {
    console.log("Error creating presigned URL", error);
  }
}
