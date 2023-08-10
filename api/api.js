async function loadAndProcessImage() {
  const inputImage = document.getElementById("inputImage");
  const outputImageElement = document.getElementById("outputImage");

  if (inputImage.files.length === 0) {
    alert("Please select an image.");
    return;
  }

  const selectedFile = inputImage.files[0];
  const formData = new FormData();
  formData.append("image", selectedFile);

  try {
    const response = await fetch("your_api_endpoint_here", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      alert("Error processing the image.");
      return;
    }

    const responseData = await response.blob();
    const imageUrl = URL.createObjectURL(responseData);
    outputImageElement.src = imageUrl;
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing the image.");
  }
}