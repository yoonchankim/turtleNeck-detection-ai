        // More API functions here:
        // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
    
        // the link to your model provided by Teachable Machine export panel
        const URL = "./my_model/";
        const good_audio=document.querySelector(".good_audio");
        const turtle_audio=document.querySelector(".turtle_audio");
        const turtle=document.getElementById("turtle");
        let model, webcam, labelContainer, maxPredictions;
    
        // Load the image model and setup the webcam
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
    
            // load the model and metadata
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // or files from your local hard drive
            // Note: the pose library adds "tmImage" object to your window (window.tmImage)
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            setInterval(webcamAudioAlert,5000);
            // Convenience function to setup a webcam
            webcam = new tmImage.Webcam(200, 200, true); // width, height, flip
            await webcam.setup(); // request access to the webcam
            await webcam.play();
            window.requestAnimationFrame(loop);
    
            // append elements to the DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }
        }
    
        async function loop() {
            webcam.update(); // update the webcam frame
            await predict();
            window.requestAnimationFrame(loop);
        }
    
        // run the webcam image through the image model
        async function predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            if(prediction[0].probability.toFixed(2)>=0.80){
                turtle.innerHTML ="거북목 자세에요";
            }
            else if(prediction[0].probability.toFixed(2)<=0.20){
                turtle.innerHTML ="바른 자세에요";
            }
            else{
                turtle.innerHTML ="몰라요";
            }
            //  for (let i = 0; i < maxPredictions; i++) {
            //      const classPrediction =
            //          prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            //      labelContainer.childNodes[i].innerHTML = classPrediction;
            //  }
        }
        function webcamAudioAlert(){
            if(turtle.innerHTML==="바른 자세에요"){
                good_audio.play();
            }
            else if(turtle.innerHTML==="거북목 자세에요"){
                turtle_audio.play();
            }
        }