/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      's3.us-west-2.amazonaws.com', // Images coming from Notion
      'via.placeholder.com', // for articles that do not have a cover image
      'images.unsplash.com',
      'dwgyu36up6iuz.cloudfront.net',
      'cdn.hashnode.com',
      'res.craft.do',
      'prod-files-secure.s3.us-west-2.amazonaws.com', // Add this line for the new hostname
      'res.cloudinary.com'
    ]
  }
};
