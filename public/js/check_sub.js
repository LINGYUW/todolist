function getDay(year,month){
	let days = [31,28,31,30,31,30,31,31,30,31,30,31];
	if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) days[1]++;
	return days[month-1];
}

function check(){
	let title = document.getElementById("title").value;
	let year = document.getElementById("year").value;
	let month = document.getElementById("month").value;
	let day = document.getElementById("day").value;
	let tips = document.getElementById("tips");
	if(title == ""){
		tips.innerHTML = "请输入合法的标题";
		return false;
	}else if(year == "" || isNaN(year)){
		tips.innerHTML = "请输入合法的年份";
		return false;
	}else if(month == "" || isNaN(month) || month > 12 || month < 1){
		tips.innerHTML = "请输入合法的月份";
		return false;
	}else if(day == "" || isNaN(day) || day > getDay(year,month)){
		tips.innerHTML = "请输入合法的日期";
		return false;
	}
	return true;
}
