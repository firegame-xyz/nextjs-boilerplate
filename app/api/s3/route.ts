import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateRandomString } from "@/app/utils/helpers";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		await file.arrayBuffer();
		const fileExtension = file.name.split(".").pop();
		const timestamp = Date.now();
		const randomString = generateRandomString(5);
		const fileName = `${timestamp}-${randomString}.${fileExtension}`;
		const filePath = `uploads/${fileName}`;
		const bucket = "avatar";

		// const params = {
		// 	Bucket: process.env.AWS_S3_BUCKET,
		// 	Key: `uploads/${fileName}`,
		// 	Body: Buffer.from(buffer),
		// 	ContentType: file.type,
		// };

		// const command = new PutObjectCommand(params);
		// await s3Client.send(command);

		const { error } = await supabase.storage
			.from(bucket)
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: false, // 设置为 true 如果你想覆盖同名文件
			});

		if (error) throw error;

		const {
			data: { publicUrl },
		} = supabase.storage.from(bucket).getPublicUrl(filePath);

		// console.log(publicUrl);

		return NextResponse.json({
			message: "File uploaded successfully",
			fileName: fileName,
			url: publicUrl,
		});
	} catch (error) {
		console.error("Error uploading file:", error);
		return NextResponse.json({ error: "File upload failed" }, { status: 500 });
	}
}
