const generateForm = document.querySelector(".generate-form");
const ImageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "https://api.openai.com/v1/images/generations"

async function generateAiImages(userPrompt, userImageQuantity) {

    function updateImageCard(imgDataArray) {
        imgDataArray.forEach((imgObject, index) => {
            const imgCard = ImageGallery.querySelectorAll(".img-card")[index];
            const imgElement = imgCard.querySelector("img");
            const downloadBtn = imgCard.querySelector(".download-btn");


            const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
            imgElement.src = aiGeneratedImg;

            imgElement.onload = () => {
                imgCard.classList.remove("loading");
                downloadBtn.setAttribute("href", aiGeneratedImg);
                downloadBtn.setAttribute("download", `${userPrompt}.jpg`);
            }
        });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImageQuantity),
                size: "512x512",
                response_format: "b64_json"
            })



        });

        if (!response.ok) throw new Error("Failed to generate Images")
        const { data } = await response.json();
        console.log(data);
        updateImageCard([...data])

    } catch (error) {
        alert(error.message)
    }
}

generateForm.addEventListener("submit", function (event) {
    // user input and image quantity values from the form 
    event.preventDefault()
    const userPrompt = event.srcElement[0].value;
    const userImageQuantity = event.srcElement[1].value;

    // creating HTML markup for image cars with loading state 
    const imgCardMarkup = Array.from({ length: userImageQuantity }, function () {
        return (
            `  <div class="img-card loading">
            <img src="images/loader.svg" alt="img">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="download-icon">
            </a>
            </div>`
        )
    }


    ).join("");

    // console.log(imgCardMarkup)

    ImageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImageQuantity);





})
