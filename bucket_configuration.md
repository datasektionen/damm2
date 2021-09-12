# Configuring the S3 bucket on AWS

The S3 bucket consists of four folders:
- patches
- patch-files
- artefacts
- artefact-files

`patches` and `artefacts` contain the images and should be publicly readable. `patch-files` and `artefact-files` contain files belonging to the objects. `patch-files` can only be accessed by admins and should not be publicly accessible. `artefact-files` however can be accessed by anyone.

The following bucket policy sets the above rules, and can be set by navigating to the bucket, `Permissions` and `Bucket policy`. Paste the following template:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::dsekt-damm-dev/patches/*"
        },
        {
            "Sid": "PublicRead",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion"
            ],
            "Resource": "arn:aws:s3:::dsekt-damm-dev/artefact*"
        }
    ]
}
```

Replace `dsekt-damm-dev` with the name of your bucket.