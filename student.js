var studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const searchBtn = document.getElementById("searchBtn");
const searchRegno = document.getElementById("searchRegno");

var regNumber = document.getElementById("reg_no");
var stuName = document.getElementById("name");
var stuDepartment = document.getElementById("dept");
var stuYear = document.getElementById("year");
var stuSection = document.getElementById("section");
var stuActivity = document.getElementById("activity");


searchBtn.addEventListener("click",() =>{
    retriveStudentData();
})

function displayStudent(data){
    
    studentTableBody.innerHTML = "";

    if (data.length === 0) {
        studentTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">No records found</td>
            </tr>
        `;
        return;
    }

    data.forEach(student => {
        const row = document.createElement("tr");        
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.department}</td>
            <td>${student.year}</td>
            <td>${student.section}</td>
            <td>${student.activity}</td>
        `;
        studentTableBody.appendChild(row);
    });
}

async function submitStudentData() {
    try{
        data = {
            action:"insert",
            regNumber:regNumber.value,
            name:stuName.value,
            department:stuDepartment.value,
            year:stuYear.value,
            section:stuSection.value,
            activity:stuActivity.value
        }
        console.log(data);
        let response = await postCall(
            "/student",
            JSON.stringify(
                data
            )
        );
        response = JSON.parse(response.body);
        if (response.success){
            alert(response.message);
            studentForm.reset();
            return;
        }
        else{
            alert("Error while insert the Student Data.");
            return;
        }
    }
    catch (err) {
    console.error(err);
    alert("Error insert student data.");
  }
}

async function retriveStudentData() {
    try{
        data = {
            action:"retrive",
            regnumber:searchRegno.value
        }
        let response = await postCall(
            "/student",
            JSON.stringify(
                data
            )
        );
        response = JSON.parse(response.body);
        if(response.success){
            stuData = response.result.data;
            displayStudent([stuData]);
        }
        else{
            alert("Error while fetching student Data.");
            searchRegno.value = "";
            return;
        }
    }
    catch(err){
        alert("Error retrive student.")
        searchRegno.value = "";
        return;
    }
}
studentForm.addEventListener("submit",function(e){
    e.preventDefault();
    submitStudentData();
})


