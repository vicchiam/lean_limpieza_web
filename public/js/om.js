new Vue({
	el: '#app',	
	created(){
		this.readCookie();
		this.getUsuario();
		this.getAfecta();
		this.getMaquinas();
	},
	data:{
		usuarios: [],
		form:{
			usuario: -1,
			planta: '',
			opcion: 'maquina',
			maquina: {
				id: 0,
				nombre: ''
			},
			instalacion: {
				id: 0,
				nombre: ''
			},
			vehiculo: {
				id: 0,
				nombre: ''
			},
			zona:{
				id: 0,
				nombre: ''
			},
			afecta: -1,
			descripcion: '',
		},
		afecta:[],
		rows: [],
        cols: ['codigo','nombre','centro'],                    
        colsOpt: [
            {
                col: 'codigo',
                title: 'Codigo',
                class: 'col-codigo',
                type: 'String'
            },
            {
                col: 'nombre',
                title: 'Nombre',
                class: 'text-truncate',
                type: 'String'
            },
            {
                col: 'centro',
                title: 'Planta',
                class: 'text-truncate',
                type: 'String',
                alias:{
                	 'PCS': 'Picassent',
                	 'PCS 2': 'Merca',
                	 'PCS 3': 'Teruel'
               	}
            }
        ],
        order:{
            col: 'codigo',
            type: 'asc'
        },
        filter: [        
            [
                {
	                name: 'fcodigo',
	                col: 'codigo',
	                type: 'text',
	                eval: 'includes'
	            },
	            {
	                name: 'fnombre',
	                col: 'nombre',
	                type: 'text',
	                eval: 'includes'
	            },
	            {
	                name: 'fcentro',
	                col: 'centro',
	                type: 'elements',
	                elements: [
                        { value: '', text: '*' },
                        { value: 'PCS', text: 'Picassent' },
                        { value: 'PCS 2', text: 'Merca' },
                        { value: 'PCS 3', text: 'Teruel' },
                    ],                                
                    default: ''
	            }
            ]
        ]
	},
	methods:{
		readCookie(){
			this.form.planta=Cookies.get('om_planta');			
			this.form.usuario=Cookies.get('om_usuario');	
		},
		getUsuario(){
			$.getJSON('php/router.php', {action: 'get-usuarios' })
				.done(response =>{
					this.usuarios=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},
		getAfecta(){
			$.getJSON('php/router.php', {action: 'get-afecta' })
				.done(response =>{
					this.afecta=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},
		getMaquinas(){
			$.getJSON('php/router.php', {action: 'get-maquinas' })
				.done(response =>{
					this.rows=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},
		getInstalacion(){
			$.getJSON('php/router.php', {action: 'get-instalacion' })
				.done(response =>{
					this.rows=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},
		getVehiculo(){
			$.getJSON('php/router.php', {action: 'get-vehiculos' })
				.done(response =>{
					this.rows=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},
		getZona(){
			$.getJSON('php/router.php', {action: 'get-zona' })
				.done(response =>{
					this.rows=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},
		cleanMaquina(){
			this.form.maquina.id=0;
			this.form.maquina.nombre='';
		},
		cleanInstalacion(){
			this.form.instalacion.id=0;
			this.form.instalacion.nombre='';
		},
		cleanVehiculo(){
			this.form.vehiculo.id=0;
			this.form.vehiculo.nombre='';
		},
		cleanZona(){
			this.form.zona.id=0;
			this.form.zona.nombre='';
		},
		cleanFilters(){			
			$("#fcodigo").val("");
			this.$refs.table1.setFilterValue('fcodigo','');
			$("#fnombre").val("");
			this.$refs.table1.setFilterValue('fnombre','');
			$("#fcentro").val("");
			this.$refs.table1.setFilterValue('fcentro','');
		},
		searchHandler(type){						
			this.cleanFilters();
			if(type=="maquina"){
				this.getMaquinas();
				this.form.opcion='maquina';
			}
			else if(type=="instalacion"){
				this.getInstalacion();
				this.form.opcion='instalacion';
			}
			else if(type=="vehiculo"){
				this.getVehiculo();
				this.form.opcion='vehiculo';
			}
			else if(type=="zona"){
				this.getZona();					
				this.form.opcion='zona';
			}			
		},		
		deleteHandler(type){
			if(type=="maquina")
				this.cleanMaquina();
			else if(type=="instalacion")
				this.cleanInstalacion();
			else if(type=="vehiculo")
				this.cleanVehiculo();
			else if(type=="zona")
				this.cleanZona();
		},		
		actionClikRowHandler(obj){
			if(this.form.opcion!='zona'){
				this.cleanMaquina();
				this.cleanInstalacion();
				this.cleanVehiculo();
			}

			if(this.form.opcion=='maquina'){
				this.form.maquina.id=obj.id;
				this.form.maquina.nombre=obj.nombre;
				this.form.zona.id=obj.id_zona;
				this.form.zona.nombre=obj.zona;
			}
			else if(this.form.opcion=='instalacion'){
				this.form.instalacion.id=obj.id;
				this.form.instalacion.nombre=obj.nombre;
			}
			else if(this.form.opcion=='vehiculo'){
				this.form.vehiculo.id=obj.id;
				this.form.vehiculo.nombre=obj.nombre;
			}
			else if(this.form.opcion=='zona'){
				this.form.zona.id=obj.id;
				this.form.zona.nombre=obj.nombre;
			}
		},
		cleanHandler(){
			this.cleanMaquina();
			this.cleanInstalacion();
			this.cleanVehiculo();
			this.cleanZona();
			this.form.afecta=-1;
			this.form.descripcion="";
		},
		saveHandler(){		
			Cookies.set('om_planta',this.form.planta);
			Cookies.set('om_usuario',this.form.usuario);

			if(this.form.maquina.id==0 && this.form.instalacion.id==0 && this.form.vehiculo.id==0){
				alert("Debes indicar una maquina/instalacion/vehiculo");
				return;
			}
			if(this.form.zona.id==0){
				alert("Debes indicar una Zona");
				return;
			}
			if(this.form.afecta==-1){
				alert("Debes selecionar una opcion en Afecta");
				return;
			}
			if(this.form.descripcion==""){
				alert("Debes indicar la averia en la descripcion")
				return;
			}

			let usuario=this.usuarios[this.form.usuario];

			$.post('php/router.php', {
				action: 'save', 
				usuario: usuario.nombre, 
				tipo: 1,
				id_solicitante: usuario.id,
				solicitante_nom: usuario.nombre,
				solicitante_mail: usuario.correo,
				id_maquina: this.form.maquina.id,
				id_instalacion: this.form.instalacion.id,
				id_vehiculo: this.form.vehiculo.id,
				id_lugar: this.form.zona.id,
				afecta: this.form.afecta,
				des_averia: this.form.descripcion
			})
				.done(response =>{
					if(response=="ok"){
						alert("Guardado");
						this.cleanHandler();
					}
					else
						alert(response);
				})
				.fail(err =>{
					alert(err);
				})

		}
	}
});