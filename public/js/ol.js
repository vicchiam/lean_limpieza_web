new Vue({
	el: '#app',	
	created(){
		this.getConfs();
		this.getIncs();		
	},
	mounted(){
		this.getIdDevice();
		this.getCentro();
		this.getOLs();
	},	
	computed:{
		getConfName: function(){
			if(this.form.conf!="")
				return this.form.conf+" - "+this.form.name;
			return "";
		}
	},
	data:{
		idDevice: 0,
		fcentro: 0,
		fdate: moment().format('YYYY-MM-DD'),
		ols:[],
		olIndex: 0,
		form:{
			id: 0,
			conf:'',
			name: '',
			operators: [],	 
			incs: [],
			obs: '',
			start: null,
			end: null
		},
		newInc: {
			index: 0,
			minutes: ''
		},		
		confs: [],
		incs: [],
        cols: ['conf','name'],                    
        colsOpt: [
            {
                col: 'conf',
                title: 'Codigo',        
                class: 'col-codigo',        
                type: 'String'
            },
            {
                col: 'name',
                title: 'Nombre',
                class: 'text-truncate',
                type: 'String'
            }
        ],
        order:{
            col: 'conf',
            type: 'asc'
        },
        filter: [        
            [
                {
	                name: 'fconf',
	                col: 'conf',
	                type: 'text',
	                eval: 'includes'
	            },
	            {
	                name: 'fname',
	                col: 'name',
	                type: 'text',
	                eval: 'includes'
	            }
            ]
        ],
        titleButtons:[
			{
				action: 1,
				image: '/img/material_svg/exit_to_app_white_24px.svg',				
				title: 'Volver'
			}
		],
		buttons: [
			{
				action: 2,
				image: '',
				class: 'd-none',
				title: ''
			},
		]
	},
	methods:{
		getIdDevice(){
			var localStorage = window.localStorage;
			var id = localStorage.getItem('idDevice');
			if(id === 'undefined' || id == null){
				id = parseInt( (Math.random() * (1000 - 1) +1),10);
				localStorage.setItem('idDevice', id); 
			}			
			this.idDevice = id;
			$("#idDevice").html(id);			
		},		
		getCentro(){
			var localStorage = window.localStorage;
			var centro = localStorage.getItem('centro');
			if(centro === 'undefined' || centro == null){
				centro = 0;
			}
			this.fcentro= centro;
		},		
		getConfs(){
			$.getJSON('php/router.php', {action: 'get-confs' })
				.done(response =>{
					this.confs=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},	
		getIncs(){
			$.getJSON('php/router.php', {action: 'get-incs' })
				.done(response =>{
					this.incs=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},	
		getOLs(){
			$.getJSON('php/router.php', {action: 'get-ols', idDevice: this.idDevice, center: this.fcentro, date: this.fdate })
				.done(response =>{
					this.ols=response.data
					this.olIndex=0;
				})
				.fail(err =>{
					alert(err);
				})
		},
		changeCentroHandler(){
			var localStorage = window.localStorage;
			localStorage.setItem('centro', this.fcentro); 
		},
		changeDateHandler(){
			this.getOLs();
		},
		addOLHandler(){
			$("#panel0").addClass('d-none');
			$("#panel1").removeClass('d-none');
			$("#panel2").addClass('d-none');

			this.form={
				id: 0,
				conf:'',
				name: '',
				operators: [],	 
				incs: [],
				obs: '',
				start: null,
				end: null
			};

			this.newInc={
				index: 0,
				minutes: ''
			}

		},
		editOLHandler(index, e){
			$('.ol').each(function(){			
				$(this).removeClass('bg-info');
			});
			$(e.currentTarget).addClass('bg-info');
			

			this.olIndex=index;
			var ol=this.ols[index];
			this.form={
				id: ol.id,
				conf: ol.conf,
				name: ol.name,
				operators: ol.operators,	 				
				incs: ol.incs,
				obs: ol.obs,
				start: ol.start,
				end: ol.end
			};

			this.newInc={
				index: 0,
				minutes: ''
			}

			$("#panel0").addClass('d-none');
			$("#panel2").addClass('d-none');
			$("#panel1").removeClass('d-none');					
		},
		searchConfHandler(){
			$("#panel1").addClass('d-none');
			$("#panel2").removeClass('d-none');
		},
		deleteConfHandler(){
			this.form.conf.code='';
			this.form.conf.name='';
		},
		actionClickHandler(action, obj){
			if(action==1){				
				$("#panel2").addClass('d-none');
				$("#panel1").removeClass('d-none');												
			}
		},
		actionClikRowHandler(obj){
			this.form.conf=obj.conf;
			this.form.name=obj.name;
			$("#panel2").addClass('d-none');
			$("#panel1").removeClass('d-none');	
		},
		addOpeHandler(){
			var ope= {
				id: 0,
				id_app: this.form.id,
				start: ( (this.form.start==null)?null:moment().format('HH:mm') ),
				end: null 
			}

			if(ope.id_app==0){
				this.$set(this.form.operators, this.form.operators.length, ope);
			}
			else{
				$.post('php/router.php',{ 
					action: 'save-ope',
					id_app: this.form.id
				})
				.done(response =>{
					if(!isNaN(response)){
						ope.id=response;
						this.$set(this.form.operators, this.form.operators.length, ope);
					}
					else
						alert(response);
				})
				.fail(err =>{
					alert(err);
				})
			}
			
		},
		endOpeHandler(index){
			var noEnd=0;
			for(var ope of this.form.operators){
				if(ope.end==null) noEnd++;
			}
			if(noEnd<=1)
				return alert("No se puede quedar una orden abierta sin operators");
			var ope=this.form.operators[index];
			ope.end=moment().format('HH:mm');
			this.$set(this.form.operators,index,ope);
		},
		deleteOpeHandler(index){
			this.$delete(this.form.operators,index);
		},
		addIncHandler(){
			if(this.newInc.minutes==''){
				return alert("Debes indicar los minutos");
			}
			var inc=this.incs[this.newInc.index];
			var obj={
				code: inc.code,
				name: inc.name,
				minutes: this.newInc.minutes
			}
			this.addInc(obj);	
		},
		addIncAlmuerzoHandler(){
			var obj={
				code: 'ALMUERZO',
				name: 'Almuerzo, merienda o cena',
				minutes: 30
			}
			this.addInc(obj);	
		},
		addInc(obj){
			$.post('php/router.php',{ 
					action: 'save-inc',
					id_app: this.form.id,
					code: obj.code,
					minutes: obj.minutes
				})
				.done(response =>{
					if(!isNaN(response)){
						obj.id=response;
						this.$set(this.form.incs,this.form.incs.length,obj);
						this.newInc.index=0;
						this.newInc.minutes='';
					}
					else
						alert(response);
				})
				.fail(err =>{
					alert(err);
				})			
		},
		deleteIncHandler(index){
			this.$delete(this.form.incs,index);
		},
		startHandler(){
			if(this.form.code=='')
				return alert("Debes indicar una configuraci&oacute;nn")

			if(this.form.operators.length==0){
				var ope= {
					id: 0,
					id_app: 0,
					start: moment().format('HH:mm'),
					end: null 
				}
				this.$set(this.form.operators, this.form.operators.length, ope);
			}
			else{
				var i=0;
				for(var ope of this.form.operators){
					ope.start=moment().format('HH:mm');
					this.$set(this.form.operators, i, ope);
					i++;
				}
			}
			this.form.start=moment().format('YYYY-MM-DD HH:mm:ss');

			var ol={
				id: 0,
				idDevice: this.idDevice,
				conf: this.form.conf,
				name: this.form.name,				
				operators: this.form.operators,
				incs: this.form.incs,
				start: this.form.start,
				end: null,
				obs: this.form.obs
			}

			$.post('php/router.php',{ 
				action: 'save-ol',
				center: this.fcentro,
				idDevice: this.idDevice,
				conf: this.form.conf,			
				operators: this.form.operators.length,
				obs: this.form.obs
				})
				.done(response =>{
					if(response=='ok'){
						this.olIndex = this.ols.length;
						this.$set(this.ols,this.ols.length,ol);

						this.getOLs();

						$("#panel0").removeClass('d-none');
						$("#panel1").addClass('d-none');
						$("#panel2").addClass('d-none');
					}
					else
						alert(response);
				})
				.fail(err =>{
					alert(err);
				})
		},
		endHandler(){
			var i=0;
				for(var ope of this.form.operators){
					if(ope.end==null){
						ope.end=moment().format('HH:mm');
						this.$set(this.form.operators, i, ope);
					}
					i++;
				}
			this.form.end=moment().format('YYYY-MM-DD HH:mm:ss');	

			var ol=this.ols[this.olIndex];			
			ol.end=this.form.end;
			this.$set(this.ols,this.olIndex,ol);

			$("#panel0").removeClass('d-none');
			$("#panel1").addClass('d-none');
			$("#panel2").addClass('d-none');
		},
		dateFormat(date){
			if(date=='' || date==null)
				return '';
			return moment(date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm');
		}
	}
});