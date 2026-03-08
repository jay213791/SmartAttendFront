// GLOBAL VARIABLES PARA SA CARDS PAGINATION//
let allCards = [];
let currentPage = 1;
const cardsPerPage = 12;


const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const searchValue = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".card-box");

    cards.forEach(card => {

        const text = card.textContent.toLowerCase();

        if (text.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});

function openAddStudentModal(){
    document.getElementById("addSectionModal").style.display="block";
}

function closeAddSectionModal(){
    document.getElementById("addSectionModal").style.display="none";
}

document.getElementById("studentSectionForm").addEventListener("submit", function (e){
    e.preventDefault();
    sectionForm();
});

async function sectionForm(){
    const sectionName = document.getElementById("SectionName").value;
    const subjectName = document.getElementById("SubjectName").value;

    if (!sectionName || !subjectName) {
        Swal.fire({
            icon: 'warning',
            title: "Missing Fields",
            text: "Please section email and subject",
        });
        return;
    }

    try{
        const response = await fetch(`/cards/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: sectionName,
                subjectName: subjectName,
            })
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Card Added",
                text: "Section created successfully",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                document.getElementById("addSectionModal").style.display = "none";
            });

            loadCards();
        }

    } catch (error){
        console.error("Error adding card:", error);
    }

}

window.onload = loadCards;

async function loadCards(){

    try{
        const response = await fetch(`/cards/my-cards`, {
            method: "GET"
        });

        allCards = await response.json();

        renderCards();
        renderPagination();

    } catch (error) {
        console.error("Error adding card:", error);
    }
}

function renderCards(){

    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    const pageCards = allCards.slice(start,end);

    // must delete the console para lang toh sa see the logics //
    console.log("Current page:", currentPage);
    console.log("Start index:", start);
    console.log("End index:", end);
    console.log("Cards shown:", pageCards);

    pageCards.forEach(card => {

        const cardsElement = document.createElement("div");

        cardsElement.classList.add("card-box");

        cardsElement.innerHTML = `

            <div class="card-header">
                <button class="menu-btn">⋮</button>

                <div class="menu-dropdown">
                    <div onclick="renameSection(${card.id}, '${card.name}')">Rename Section</div>
                    <div onclick="renameSubject(${card.id}, '${card.subjectName}')">Rename Subject</div>
                    <div onclick="deleteCard(${card.id})">Delete</div>
                </div>
            </div>

            <div class="card-body">
                <span>${card.name}</span>
                <p>${card.subjectName}</p>
            </div>

        `;

        const cardBody = cardsElement.querySelector(".card-body");
        cardBody.addEventListener("click", (e) => {
             window.location.href = `/../body/studentTable.html`;
           // window.location.href = `/../body/studentTable.html/${card.id}`;//
        });

        cardsContainer.appendChild(cardsElement);


    });

}

function renderPagination(){

    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(allCards.length / cardsPerPage);

    for(let i=1;i<=totalPages;i++){

        const btn = document.createElement("button");

        btn.classList.add("page-btn");
        btn.textContent = i;

        if(i === currentPage){
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentPage = i;
            renderCards();
            renderPagination();
        };

        pagination.appendChild(btn);

    }


}

document.addEventListener("click", function(e){
    if(e.target.classList.contains("menu-btn")){
        const menu = e.target.nextElementSibling;
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    } else {
        document.querySelectorAll(".menu-dropdown").forEach(menu=>{
            menu.style.display = "none";
        });
    }
});

function renameSection(id, currentName){

    Swal.fire({
        title: "Rename Section",
        input: "text",
        inputValue: currentName,
        showCancelButton: true
    }).then((result)=>{

        if(result.isConfirmed){

            fetch(`/cards/${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: result.value
                })
            })
                .then(response=>response.json())
                .then(data=>{
                    Swal.fire({
                        icon: "success",
                        title: "Rename Section",
                        text: "Section updated successfully",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload();
                    });
                });

        }

    });

}


function renameSubject(id, currentSubjectName){

    Swal.fire({
        title: "Rename Subject",
        input: "text",
        inputValue: currentSubjectName,
        showCancelButton: true
    }).then((result)=>{

        if(result.isConfirmed){

            fetch(`/cards/${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    subjectName: result.value
                })
            })
                .then(response=>response.json())
                .then(data=>{
                    Swal.fire({
                        icon: "success",
                        title: "Rename Subject",
                        text: "Subject updated successfully",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload();
                    });
                });

        }

    });

}

function deleteCard(id){

    Swal.fire({
        title: "Delete this card?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it"
    }).then((result)=>{

        if(result.isConfirmed){

            fetch(`/cards/delete/${id}`,{
                method:"DELETE"
            })
                .then(res=>{
                    if(res.ok){

                        Swal.fire({
                            icon: "success",
                            title: "Card has been deleted.",
                            text: "success",
                            timer: 1000,
                            showConfirmButton: false
                        }).then(() => {
                            loadCards();
                        });

                    }else{
                        Swal.fire(
                            "Error",
                            "Could not delete card.",
                            "error"
                        );
                    }
                });

        }

    });

}