window.onload = function () {
	var imgArea = document.querySelector('.img-area');
	var imgAreaTip = imgArea.children[0];
	var codeArea = document.querySelector('.code-area');
	var result = {};

	function dragInit () {
		imgArea.addEventListener('dragenter', handleDragEnter, false);
		imgArea.addEventListener('dragover', handleDragEnter, false);
		imgArea.addEventListener('dragleave', handleDragLeave, false);
		imgArea.addEventListener('drop', handleDrop, false);
	}
	function handleDragEnter (e) {
		e.preventDefault();
		imgAreaTip.innerText = "释放生成DataURL";
	}
	function handleDragLeave () {
		imgAreaTip.innerText = "将图片拖拽至此";
	}
	function handleDrop (e) {
		e.preventDefault();
		imgAreaTip.innerText = "处理中...";
		result = {};
		var files = Array.prototype.slice.call(e.dataTransfer.files);
		var reader = new FileReader();
		files.forEach(function (t) {
			reader.onload = function(event) {
				result[t.name] = event.target.result;
				codeArea.innerText = event.target.result;
				imgAreaTip.innerText = "将图片拖拽至此";
			};
			reader.readAsDataURL(t);
		});
	}
	dragInit();
};