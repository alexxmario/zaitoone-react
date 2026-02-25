# Video Setup Instructions

## Add Your Video Here

Place your video file as `intro.mp4` in this directory.

## Video Requirements

- **Format**: MP4 (H.264 codec recommended)
- **Duration**: 5-15 seconds works best
- **Size**: Keep under 10MB for faster loading
- **Resolution**: 1920x1080 or 1280x720
- **Aspect Ratio**: 16:9 recommended

## Where to Get Videos

### Option 1: Free Stock Videos
Download from these sites (all offer free videos):
- **Pexels**: https://www.pexels.com/videos/
- **Pixabay**: https://pixabay.com/videos/
- **Coverr**: https://coverr.co/

Search for: "Lebanese food", "restaurant", "cooking", "food preparation"

### Option 2: Create Your Own
Record a short video of:
- Your restaurant interior
- Food being prepared
- Dishes being plated
- Restaurant ambiance

### Option 3: Use AI Video Generator
- **Runway**: https://runwayml.com/
- **Pika Labs**: https://pika.art/

## Quick Download Example

```bash
# Download a free stock video from Pexels (using their API or direct link)
# Replace with actual video URL
curl -L -o intro.mp4 "YOUR_VIDEO_URL_HERE"
```

## Testing

After adding your video, the ScrollVideo component will automatically use it.
If no video is found, it will show the fallback image instead.
