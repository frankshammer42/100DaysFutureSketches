window.onload = getAllCurrentFolders;

function compare(a, b){
    a = a.slice(3, a.length);
    b = b.slice(3, b.length);
    a = parseInt(a);
    b = parseInt(b);
    if (a > b){
        return 1;
    }
    else{
        return -1;
    }

}

function getAllCurrentFolders(){
    axios.get('/Days').then(
        function (response) {
            let filenames = response.data;
            filenames.sort(compare);
            for (let i=0; i<filenames.length; i++) {
                let buttonContainer = document.createElement('div');
                buttonContainer.classList.add("DayButtonContainer");
                let button = document.createElement('button');
                button.classList.add("DayButton");
                button.innerText = filenames[i];
                buttonContainer.appendChild(button);
                document.body.appendChild(buttonContainer);
                let path = "/days/" + filenames[i] + "/home.html";
                button.onclick = () => {
                    window.open(path);
                };
            }
        }
    );
}