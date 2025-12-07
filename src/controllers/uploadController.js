const { s3, bucket } = require('../config/awsS3');
const { v4: uuid } = require('uuid');

const getSignedUrl = async (req, res) => {
    try {
        const { filename, contentType } = req.body || {};
        if (!filename || !contentType) {
            return res.status(400).json({ error: 'Filename and contentType are required' });
        }
        const cleanName = filename.toString().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');
        const key = `products/${uuid()}_${cleanName}`;
        const params = {
            Bucket: bucket,
            Key: key,
            contentType: contentType,
            ACL: 'public-read',
        };
        const url = await s3.getSignedUrlPromise('putObject', params);
        res.status(200).json({ url, key, publicUrl: `https://${bucket}.s3.amazonaws.com/${key}` });        
    } catch (error) {
        console.log('Error generating signed URL:', error);
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
};

module.exports = { getSignedUrl };