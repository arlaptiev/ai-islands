const INSTRUCT_PIX2PIX_TIMEOUT = 6000;
const INSTRUCT_PIX2PIX_PROMPT = "island in the pacific from bird view";

async function loadAndProcessImage() {
  const imageUrlInput = document.getElementById("imageUrl");
  const outputImageElement = document.getElementById("outputImage");
  const inputImageElement = document.getElementById("inputImage");

  const imageUrl = imageUrlInput.value.trim();

  if (!imageUrl) {
    alert("Please enter an image URL.");
    return;
  }

  // set input image
  outputImageElement.src = "https://placehold.co/400?text=...";
  inputImageElement.src = imageUrl;

  try {
    // Request prediction

    const predReqData = await replicateApiPost("predictions", {
      "version": "30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
      "input": {
        "image": imageUrl,
        "prompt": INSTRUCT_PIX2PIX_PROMPT
      }
    })

    const predId = predReqData.id;

    // Get resulting prediction

    async function updateOutput () {
      const predData = await replicateApiGet("predictions/" + predId)
      if (predData.status == "succeeded") {
        // recieved output
        const imageUrl = predData.output[0];
        outputImageElement.src = imageUrl;
        return 1;
      }
    }

    async function runAfterTimeout(functionToRun, timeout, times) {
      console.log('running after timeout')
      if (times > 0) {
        if (await functionToRun()) {
          return;
        }
        await setTimeout(function() {
          runAfterTimeout(functionToRun, timeout, times - 1);
        }, timeout);
      }
    }

    setTimeout(async function() {
      let success = await updateOutput();
      if (!success) {
        await runAfterTimeout(updateOutput, 1000, 5)
      }
    }, INSTRUCT_PIX2PIX_TIMEOUT);

  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing the image.");
  }
}