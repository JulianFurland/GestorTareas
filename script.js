var arrayProyectos = [];
console.log(arrayProyectos);
var proyectoActual;

function IngresarProyecto(){
    
    let input = document.getElementById("InputNombreProyecto");
    let nombreProyecto = input.value;
    let proyecto = {
        nombre: nombreProyecto,
        desc: null,
        taskArray: []
    }
    if(FindProyecto(proyecto, arrayProyectos) == -1 && nombreProyecto != ""){
        
        AgregarProyectoAArray(proyecto);
        MostrarProyecto(proyecto);
    }
    else{
        alert("El nombre del proyecto no es correcto o ya existe");
    }
}

function AgregarProyectoAArray(proyecto){
    arrayProyectos.push(proyecto);
    SyncStorage("arrayProyectos", arrayProyectos);
}

function MostrarProyecto(proyecto){
    let divDisplay = document.getElementById("divDisplay");
    let divProy = document.createElement("div");

    let divLink = document.createElement("div");
    divLink.onclick = function() {IrAPaginaProyecto(proyecto);};
    divProy.appendChild(divLink);

    let nombreProyecto = document.createElement("h3");
    nombreProyecto.innerHTML = `${proyecto.nombre}`;
    divLink.appendChild(nombreProyecto);

    let btnBorrar = document.createElement("button");
    btnBorrar.onclick = function() {EliminarProyecto(proyecto)};
    divProy.appendChild(btnBorrar);

    let imgBorrar = document.createElement("img");
    imgBorrar.src = "delete.png";
    imgBorrar.className = "imgborrar";
    btnBorrar.appendChild(imgBorrar);
    divProy.className = "divProy";

    divDisplay.appendChild(divProy);
}

function EliminarProyecto(proyecto){
    let array = GetFromStorage('arrayProyectos');
    let index = FindProyecto(proyecto,array);
    array.splice(index,1);
    SyncStorage("arrayProyectos",array);
    LimpiarProyectos();
    PageLoad();
}

function PageLoad(){
    document.getElementById("divDisplay").innerHTML = "";
    let array = GetFromStorage('arrayProyectos');
    if(array!=null){
        SyncStorage("arrayProyectos", array);
        array.forEach(element => {
            MostrarProyecto(element);
        });  
    }
}

function IrAPaginaProyecto(proyecto){
    SyncStorage("proyectoActual", proyecto)
    window.location.href = "proyecto.html";
}

function VolverAlIndex(proyecto){
    window.location.href = "index.html";  
}

function LimpiarProyectos(){
    document.getElementById("divDisplay").innerHTML = "";
}

function GetFromStorage(str){
    return JSON.parse(sessionStorage.getItem(str)); 
}

function SetToStorage(varName, elem){
    sessionStorage.removeItem(varName);
    sessionStorage.setItem(varName, JSON.stringify(elem));
}

function SyncStorage(varName, elem){
    SetToStorage(varName, elem);
    switch (varName) {
        case "arrayProyectos":
            arrayProyectos = elem;
            break;
        case "proyectoActual":
            proyectoActual = elem;
            break;
        default:
            console.log("Error 404")
            break;
    }
    
}

function CargarProyecto(){
    proyectoActual = GetFromStorage("proyectoActual");
    console.log(proyectoActual);
    let titulo = document.getElementById("h1Titulo");
    titulo.innerHTML = proyectoActual.nombre;
    var divDisplay = document.getElementById("divDisplay");
    divDisplay.innerHTML = "";
    DisplayTasks(proyectoActual.taskArray); 
}

function UpdateProyecto(proyecto){
    let localArrayProyectos = GetFromStorage("arrayProyectos");
    let index = FindProyecto(proyecto, localArrayProyectos);
    localArrayProyectos[index] = proyecto;
    SetToStorage("arrayProyectos", localArrayProyectos);
    arrayProyectos = localArrayProyectos;
    
}

function FindProyecto(proyecto, array){
    const igualNombre = (element) => element.nombre == proyecto.nombre;
    let index = array.findIndex(igualNombre);
    console.log(index);
    return index;
}

function FindTarea(proyecto, tarea){
    const igualNombre = (element) => element.title == tarea.title;
    let index = proyecto.taskArray.findIndex(igualNombre);
    return index;
}

//Tareas
function AgregarTarea(){
    let inputTitle = document.getElementById('inputTaskTitle');
    let inputDesc = document.getElementById('inputTaskDesc');
    let inputExpire = document.getElementById('inputTaskExpire');
    let localProyectoActual = GetFromStorage("proyectoActual");
    if(inputTitle.value != "" && inputDesc.value != ""){
        let displayArray = [];
        var divDisplay = document.getElementById("divDisplay");
        console.log(divDisplay);
        divDisplay.innerHTML = "";
        let task = {title: "", desc: "", crossed: false, expire: "undefined"};
        task.title = inputTitle.value;
        task.desc = inputDesc.value;
        task.expire = inputExpire.value;
        localProyectoActual.taskArray.push(task);
        UpdateProyecto(localProyectoActual);
        displayArray = localProyectoActual.taskArray;
        inputTitle.value = "";
        inputDesc.value = "";
        DisplayTasks(displayArray)
        SyncStorage("proyectoActual",localProyectoActual);
    }
}
function DisplayTasks(array){
    array.forEach(element => {
        let btnTick = document.createElement("button");
        btnTick.style.borderRadius = "100%";
        btnTick.style.width = "35px";
        btnTick.style.height = "35px";
        btnTick.onclick = function() {TaskTick(element);};
        let pTaskTitle = document.createElement("h4");
        let pTaskDesc = document.createElement("p");
        pTaskTitle.innerHTML = `${element.title}:`;
        if(element.crossed){
            pTaskTitle.style.textDecoration = "line-through";
            pTaskDesc.innerHTML = `${element.desc}`;
            btnTick.innerHTML = `<img src="tick.png" alt="" class="btntickimg">`;
        }
        else{
            pTaskDesc.innerHTML = `${element.desc} <br> Válido hasta: ${element.expire}`;
        }
        
        var divPanel = document.createElement("div");
        var divDisplay = document.getElementById("divDisplay");
        console.log(divDisplay)
        let divLine = document.createElement("div");
        divLine.className = "line";
        divPanel.appendChild(pTaskTitle);
        divPanel.appendChild(pTaskDesc);
        divLine.appendChild(divPanel);
        divLine.appendChild(btnTick);
        divDisplay.appendChild(divLine);
        divDisplay.appendChild(document.createElement("hr"));
    });
}

function TaskTick(tarea){
    tarea.crossed = !tarea.crossed;
    let localProyecto = GetFromStorage("proyectoActual");
    let indexTarea = FindTarea(localProyecto, tarea);
    localProyecto.taskArray[indexTarea] = tarea;
    SyncStorage("proyectoActual",localProyecto);
    proyectoActual = localProyecto;
    UpdateProyecto(localProyecto);
    CargarProyecto();
}

function TareasPorVencimiento(){
    MostrarBtnVolver();
    let divDisplay = document.getElementById("divDisplay");
    divDisplay.innerHTML = "";
    let inputDate = document.getElementById("InputFechaVencimiento").value;
    let dateTaskArray = [];
    arrayProyectos.forEach(element => {
        element.taskArray.forEach(task => {
            if(task.expire == inputDate){
                dateTaskArray.push(task);
            }
        });
        let h2TitleProyecto = document.createElement("h2");
        h2TitleProyecto.innerHTML = `${element.nombre}:`;
        DisplayTasks(dateTaskArray);
        dateTaskArray = [];
    });

}

function MostrarBtnVolver(){
    let div = document.getElementById("header");
    let btn = document.createElement("button");
    btn.innerHTML = "Volver a Proyectos"
    btn.onclick = function(){
        btn.remove();
        PageLoad();};
    div.appendChild(btn);
}