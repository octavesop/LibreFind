export const s3DirectoryGenerator = async (
  mimeType: string,
  currentDate: Date,
): Promise<string> => {
  const fileExtension = mimeType.split('/')[1];
  return `${
    process.env.AWS_BUCKET_DIR
  }/${currentDate.getTime()}.${fileExtension}`;
};

export const s3ReportDirectoryGenerator = async (
  userId: string,
): Promise<string> => {
  return `${process.env.AWS_BUCKET_DIR}/${userId}.png`;
};

export const ImageUrlGenerator = async (imageDir: string): Promise<string> => {
  const result = 'https://' + process.env.AWS_DOMAIN + imageDir;
  return result;
};

export const ContentTypeGeneratorFromBase64Buffer = async (
  imageBuffer: string,
): Promise<string> => {
  const isImageTypeBase64 = /^data:image\/\w+;base64,/;
  if (!isImageTypeBase64.test(imageBuffer)) {
    throw new Error('Image Buffer is Invalid');
  }
  const type = imageBuffer.split(';');
  return type[0].split(':')[1];
  //data:image/png;base64; 형식으로 옴.
};
