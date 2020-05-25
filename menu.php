<div class="container-fluid p-0">
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark m-0">
		<a class="navbar-brand font-shrikhand text-white ml-2" href="/">
		    Lean Limpieza
		</a>
		<ul class="navbar-nav">      		
			<li class="nav-item">
        		<a id="ol" class="nav-link active" href="#">Prueba</a>
      		</li>  
			<li class="nav-item">
        		<a id="om" class="nav-link" href="#">Orden Mantenimiento</a>
      		</li>
      		<li class="nav-item">
        		<a id="plani" class="nav-link" href="#">Planificaci&oacute;n</a>
      		</li>      		      		
      	</ul>
      	<ul class="navbar-nav ml-auto p-2 text-white">
      		<li class="nav-item" id="idDevice"></li>
      	</ul>
	</nav>		
</div>
<div class="container-fluid p-0 panel" id="main" >	
	<?php include('public/html/ol.html'); ?>
</div>
<div>
	<script type="text/javascript">

		$("#om").click(function(){
			var self=this;
			$.get('public/html/om.html')
				.done(function(response){
					$("#main").html(response);
					setActive(self);	
				})
		})

		$("#plani").click(function(){
			var self=this;
			$.get('public/html/plani.html')
				.done(function(response){
					$("#main").html(response);
					setActive(self);	
				})
		})				

		$("#ol").click(function(){
			var self=this;
			$.get('public/html/ol.html')
				.done(function(response){
					$("#main").html(response);
					setActive(self);	
				})
		})	

		function setActive(elem){
			$(".active").removeClass('active');
			$(elem).parent().addClass('active');
		}

	</script>	
</div>