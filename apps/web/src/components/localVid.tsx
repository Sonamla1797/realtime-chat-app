export default async function setupLocalStream(videoRef: React.RefObject<HTMLVideoElement>, audioOnly: boolean) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: !audioOnly, audio: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      if (audioOnly) {
        stream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
      }

      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
    }

    return stream;
  } catch (err) {
    console.error("Error accessing camera:", err);
    if (videoRef.current) {
      videoRef.current.poster = "/placeholder.svg?height=300&width=300";
    }
    return null;
  }
}
