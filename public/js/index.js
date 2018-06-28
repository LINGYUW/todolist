
function delete_list(event, id) { //删除列表
	var myMenu = document.getElementById("menu");
	event.preventDefault();
	myMenu.style.display = "block";
	myMenu.style.top = event.clientY + "px";
	myMenu.style.left = event.clientX + "px";
	document.getElementById("a_menu").href = "/deleteList?id=" + id;
	document.addEventListener("click", function(event) {
		myMenu.style.display = "none";
	});
}

function search_check() {
	let search_title = document.getElementById("search_title");
	if(search_title.value == "") return false;
	return true;
}

function my_show() {
	$("#newList").slideDown(300);
}

function my_hide() {
	$("#newList").slideUp(300);
}

function tips(obj) {
	if(obj.value == "")return;
	let param = {
		keys: obj.value
	};
	$.ajax({
		type: "get",
		url: "http://127.0.0.1:3000/tips",
		async: true,
		data: param,
		dataType: 'jsonp',
		jsonpCallback: 'callback',
		success: (data) => {
			let ul = document.getElementById("search_ul");
			let tip = document.getElementById("search_tip");
			let title = document.getElementById("search_title");
			if(data.length == 0) {
				$("#search_tip").slideUp(200);
				return;
			}
			$("#search_tip").slideDown(200);
			ul.innerHTML = "";
			let len = data.length > 5 ? 5 : data.length;
			for(let i = 0; i < len; i++) {
				let li = document.createElement("li");
				li.innerHTML = data[i].title;
				li.onclick = ()=>{
					title.value = data[i].title;
				}
				ul.appendChild(li);
			}
			document.addEventListener("click", function(event) {
				$("#search_tip").slideUp(200);
			});
		}
	});
}

$().ready(function() {
	$("#add").click(function() {
		my_show();
	});
	$("#over").click(function() {
		my_hide();
	});
});