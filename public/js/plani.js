new Vue({
	el: '#app',	
	created(){		
		this.getPlani();        
	},
    mounted(){
        this.readCookie();
    },
	data:{
		rows: [],
        cols: ['linea','producto','cantidad','dia'],                    
        colsOpt: [
            {
                col: 'linea',
                title: 'Linea',                               
                type: 'String'
            },
            {
                col: 'producto',
                title: 'Producto',
                class: 'text-truncate',
                type: 'String'
            },
            {
                col: 'cantidad',
                title: 'Cantidad',
                class: 'text-right',
                type: 'Number'
            },
            {
                col: 'dia',
                title: 'Dia',
                class: 'text-right',
                type: 'Date'
            }

        ],
        order:{
            col: 'linea',
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
	                name: 'fplanta',
	                col: 'planta',
	                type: 'elements',
	                elements: [
                        { value: '', text: '*' },
                        { value: 'Picassent', text: 'Picassent' },
                        { value: 'Merca', text: 'Merca' },
                        { value: 'Teruel', text: 'Teruel' },
                    ],                                
                    default: ''
	            },
                {
                    name: 'fdia',
                    col: 'dia',
                    type: 'date',
                    eval: '==',
                    default: moment().format('YYYY-MM-DD')
                }
            ]
        ],
        buttons: [
            {
                action: 1,
                class: '',
                image: '/img/material_svg/done-24px.svg',
                title: 'Seleccionar'
            }
        ],
	},
	methods:{
		readCookie(){
			let fplanta=Cookies.get('plani_planta');			
			$("#fplanta").val(fplanta);
            this.$refs.table1.setFilterValue('fplanta',fplanta);
		},
		getPlani(){
			$.getJSON('php/router.php', {action: 'get-plani' })
				.done(response =>{
					this.rows=response.data
				})
				.fail(err =>{
					alert(err);
				})
		},
        setPlanta(){
            let fplanta=$("#fplanta").val();
            Cookies.set('plani_planta',fplanta);
        }		
	}
});