const colorPickerBtn = document.querySelector("#color-picker");
const colorList = document.querySelector(".all-colors");
const clearAll = document.querySelector(".clear-all");
const popup = document.querySelector(".popup");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

const copyColor = elem => {
    if (document.hasFocus()) {
        navigator.clipboard.writeText(elem.dataset.color).then(() => {
            elem.innerText = "Copied";
            setTimeout(() => elem.innerText = elem.dataset.color, 1000);
        }).catch(err => {
            console.error('Failed to copy the color code:', err);
        });
    } else {
        console.error('Document is not focused. Unable to copy to clipboard.');
    }
}

const showColors = () => {
    if (!pickedColors.length) return;
    colorList.innerHTML = pickedColors.map(color =>
        `<li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${color == "#ffffff" ? "#ccc" : color}"></span>
            <span class="value" data-color="${color}">${color}</span>
        </li>`
    ).join("");

    document.querySelector(".picked-colors").classList.remove("hide");

    document.querySelectorAll(".color").forEach(li => {
        li.addEventListener("click", e => copyColor(e.currentTarget.lastElementChild));
    });
}

showColors();

const activateEyeDropper = async () => {
    try {
        if (!window.EyeDropper) {
            console.error('EyeDropper API is not supported in this browser.');
            return;
        }

        // Hide the popup
        popup.style.display = "none";

        const eyeDropper = new window.EyeDropper();
        const { sRGBHex } = await eyeDropper.open();

        // Delay clipboard operation to ensure document focus
        setTimeout(() => {
            if (document.hasFocus()) {
                navigator.clipboard.writeText(sRGBHex).then(() => {
                    if (!pickedColors.includes(sRGBHex)) {
                        pickedColors.push(sRGBHex);
                        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
                        showColors();
                    }
                }).catch(err => {
                    console.error('Failed to copy the color code:', err);
                });
            } else {
                console.error('Document is not focused. Unable to copy to clipboard.');
            }

            // Show the popup again after picking a color
            popup.style.display = "block";
        }, 50); // Small delay to allow focus to return
    } catch (error) {
        console.error("EyeDropper failed:", error);

        // Show the popup again if an error occurs
        popup.style.display = "block";
    }
}

const clearAllColors = () => {
    pickedColors.length = 0;
    localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
    document.querySelector(".picked-colors").classList.add("hide");
}

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);
