const API_KEY = "CbTW7iRWx3HsiIqUx3Sn";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageUpload = document.getElementById("imageUpload");
const resultOutput = document.getElementById("resultOutput");

imageUpload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Load image from file to draw on canvas
  const img = new Image();
  img.onload = async () => {
    // Show canvas when image loads
    canvas.style.display = "block";

    // Resize canvas to match image size
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Convert image to base64 to send to API
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      // Show "Solving..." message
      if (resultOutput) {
        resultOutput.innerText = "Solving...";
      }

      try {
        const response = await fetch(
          "https://serverless.roboflow.com/infer/workflows/swollens-workshop/custom-workflow",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              api_key: API_KEY,
              inputs: {
                image: { type: "base64", value: base64Image },
              },
            }),
          }
        );

        const result = await response.json();

        const debugMode = false;
        if (debugMode && resultOutput) {
          resultOutput.innerText = JSON.stringify(result, null, 2);
        }

        const predictions = result?.outputs?.[0]?.predictions?.predictions || [];

        if (!debugMode && resultOutput) {
          if (predictions.length > 0 && predictions[0].class) {
            resultOutput.innerText = `Solution: ${predictions[0].class}`;
          } else {
            resultOutput.innerText = "No solution found.";
            canvas.style.display = "none"; // Optionally hide canvas on failure
          }
        }

        predictions.forEach((pred) => {
          const { x, y, width, height, class: className, confidence } = pred;

          ctx.strokeStyle = "blue";
          ctx.lineWidth = 5;
          ctx.strokeRect(x - width / 2, y - height / 2, width, height);

          ctx.fillStyle = "blue";
          ctx.font = "20px Arial";
          ctx.fillText(
            `${className} (${(confidence * 100).toFixed(1)}%)`,
            x - width / 2,
            y - height / 2 - 5
          );
        });

      } catch (error) {
        resultOutput.innerText = "Error solving the image.";
        canvas.style.display = "none"; // hide canvas on error
        console.error(error);
      }
    };

    reader.readAsDataURL(file);
  };

  img.src = URL.createObjectURL(file);
});

function myFunction(x) {
  x.classList.toggle("change");
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
}
