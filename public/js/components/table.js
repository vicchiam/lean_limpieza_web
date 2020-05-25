Vue.component('chis-table', {
    /*
        rows -> array de objetos
        cols -> array con nombres de propiedades a mostrar (columnas a mostrar)
        colid -> propiedad identificativa
        colsopt -> 
            {
                col -> nombre de la propiedad a la que aplicara
                title -> titulo de la columna
                type -> tipo de dato (Para la alineación)
                class -> clases que se añadiran a la celda
                alias -> por que nombre se substituira al valor de la celda
            }
        filter ->
            {
                name -> nombre del filtro
                col -> nombre de la propiedad a la que aplicara
                type -> tipo de filtro
                eval -> como se evaluara la comprobacion (startsWith, includes)
                elements -> items que aparecerna en el filtro
                default -> item preselecionado
            }
        order -> por que propiedad se ordenara
        titleButtons -> botones que se pondran en la cabecera, el evento pasa la acción 
            {
                action -> nombre de la accion, se pasara al lanzar el evento click Ej: add (boton añadir)  
                class -> clases que se añadiran al boton
                image -> imagen que aparecera
                title -> title que aparecera
            }
        buttons -> botones que se pondran en cada fila, el evento pasa la acción y el objeto que contiene los datos de la fila
            {
                action -> nombre de la accion, se pasara al lanzar el evento click Ej: edit (boton editar)  
                class -> clases que se añadiran al boton
                image -> imagen que aparecera
                title -> title que aparecera
            }
        images -> imagenes que saldran dependiendo de una condicion
            {
                image -> imagen a mostrar
                title -> title que aparecera
                col -> columna que se evaluara
                eval -> tipo de evaluacion
                value -> valor deseado
            }
    */
    created() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    props: {        
        rows: {
            type: Array,
            required: true
        },
        cols: {
            type: Array,
            required: true
        },
        colid:{
            type: String,
            required: true
        },
        colsopt: {
            type: Array
        },
        filter: {
            type: Array,
            required: false
        },  
        order: {
            type: Object,
            required: false,
            default: {
                col:'',
                type: 'asc'
            }
        },
        titlebuttons: {
            type: Array
        },
        buttons: {
            type: Array
        },
        images: {
            type: Array
        },
        margintop:{
            default: "10",
            type: String
        }  
    },
    mounted(){
        this.filterData=this.rows;       
        this.applyFilters();
    },
    template: `
        <table class="table">
            <chis-filter :filters="filter" @chis-filter-change="changeFilterHandler" ref="filter"></chis-filter>
            <thead class="thead-dark">
                <tr>
                    <th v-for="col in cols" :class="getColClass(col)">{{ getTitle(col) }}</th>
                    <th v-if="images"></th>
                    <th class="text-right" v-if="titlebuttons || buttons">
                        <chis-cell-button v-for="(btn,index) in titlebuttons" :key="index" :baction="btn.action" :bclass="btn.class" :bimage="btn.image" :btitle="btn.title" @chis-action-click="actionClickHandler"></chis-cell-button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in getShowRows" @click="actionClickRowHandler(row)">
                    <chis-cell v-for="col in cols" :key="col" :cellclass="getColClass(col)" :cellval="getColType(col,row[col])"></chis-cell>
                    <td class="text-right text-nowrap pl-0 pr-0" v-if="images">                    
                        <chis-image v-for="(image, index) in images" :key="index" v-if="getImageToShow(row, image)" :bimage="image.image" :btitle="image.title"></chis-image>
                    </td>
                    <td class="text-right text-nowrap" v-if="buttons">
                        <chis-cell-button v-for="(btn,index) in buttons" :key="index" :bobj="row" :baction="btn.action" :bclass="btn.class" :bimage="btn.image" :btitle="btn.title" @chis-action-click="actionClickHandler"></chis-cell-button>    
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <chis-paginator :current="current" :total="size" :resultsForPage="getNumberResultsForPage" :cols="getTotalCols()" @chis-page-change="changePageHandler"></chis-paginator>
                </tr>
            </tfoot>
        </table>
    `,                
    watch:{
        rows: function(){
            if(!this.init){                
                this.defaultFilters(); 
                this.init=true;
            }
            this.applyFilters();
        }
    },
    computed:{
        getNumberResultsForPage(){
            let tableHead=50;
            let filterHeight=this.filter.length*50;
            let aux=this.sizes.height-this.sizes.top-this.sizes.bottom-tableHead-filterHeight;
            let num=Math.ceil(aux/36);                        
            return num;
        },
        getShowRows(){
            let start=((this.current-1)*this.getNumberResultsForPage);
            let end=(start+this.getNumberResultsForPage);                        
            return this.filterData.slice(start,end);
        },
        size(){
            return this.filterData.length;
        },                    
    },
    methods: {
        handleResize(){
            this.sizes.height = window.innerHeight;
        },
        getTitle(col){
            for(opt of this.colsopt){                            
                if(opt.col==col && typeof opt.title !== 'undefined' ){
                    return opt.title;
                }
            }
            return col;
        },
        getColClass(col){
            for(opt of this.colsopt){                            
                if(opt.col==col  && typeof opt.class !== 'undefined' ){
                    return opt.class;
                }
            }
        },
        getColType(col, value){
            for(opt of this.colsopt){
                if(opt.col==col){                    
                    if(opt.type=='String'){
                        return this.getColAlias(opt, value);
                    }
                    if(opt.type=='Number'){
                        return value;
                    }
                    if(opt.type=='Date'){
                        let res='';
                        var date=new Date(value);			
                        res+=date.getDate().toString().padStart(2,'0');
                        res+="-";
                        res+=(date.getMonth()+1).toString().padStart(2,'0');
                        res+="-";
                        res+=date.getFullYear().toString();			
                        return res;
                    }
                    if(opt.type=='Datetime'){
                        let res='';
                        var date=new Date(value);			
                        res+=date.getDate().toString().padStart(2,'0');
                        res+="-";
                        res+=(date.getMonth()+1).toString().padStart(2,'0');
                        res+="-";
                        res+=date.getFullYear().toString();
                        res+=" ";
                        res+=date.getHours().toString().padStart(2,'0');
                        res+=":";
                        res+=date.getMinutes().toString().padStart(2,'0');
                        return res;
                    }
                }
            }
        },
        getColAlias(opt, value){
            if(typeof opt.alias !== 'undefined' ){                    
                return opt.alias[value];
            }                             
            return value;
        },          
        getTotalCols(){
            let num=this.cols.length;
            if(typeof(this.buttons) !== 'undefined' && this.buttons.length>0){
                num++;
            }
            if(typeof(this.images) !== 'undefined' && this.images.length>0){
                num++;
            }
            return num;
        },   
        actionClickRowHandler(obj){                        
            this.$emit('chis-action-click-row',obj);
        },       
        actionClickHandler(action, obj, event){
            this.$emit('chis-action-click',action,obj,event);
        },
        changePageHandler(page){
            this.current = page;
        },
        defaultFilters(){
            for(row of this.filter){
                for(filter of row){
                    if(filter.default){
                        this.changeFilterHandler(filter.name, filter.type,filter.col,filter.eval,filter.default);
                    }
                }
            }
        },
        setFilterValue(name,value){
            for(row of this.filter){
                for(filter of row){
                    if(filter.name===name){
                        this.changeFilterHandler(filter.name, filter.type, filter.col, filter.eval, value);                        
                    }
                }
            }
        },
        changeFilterHandler(name, type, col, eval, value){                       
            this.filterArray[name]={
                name: name,
                type: type,
                col: col,
                eval: eval,
                value: value
            }  
            this.current=1;                                          
            this.applyFilters();
            this.$emit('chis-filter-change');
        },
        applyFilters(){            
            let keys=Object.keys(this.filterArray);   
            this.filterData=this.rows.filter((row) => {                                                                                
                for(key of keys){
                    let obj=this.filterArray[key];
                    if(!this.checkingFilter(row, obj))
                        return false;                                    
                }
                return true;
            });
            if(typeof(this.order.col)!='undefined'){
                let type=(this.order.type!='undefined' && this.order.type=='desc')?-1:1;
                this.filterData=this.filterData.sort( (a,b) => {
                    if(a[this.order.col]<b[this.order.col])
                        return -type;                
                    if(a[this.order.col]>b[this.order.col])
                        return type;
                    return 0;
                });
            }
        },
        checkingFilter(row, filter){            
            let value=row[filter.col]+"";        
            if(filter.value=="")
                return true;    
            if(filter.type=='text'){                
                if(filter.eval=='startsWith'){     
                    return value.toUpperCase().startsWith((filter.value+"").toUpperCase());
                }
                if(filter.eval=='includes'){
                    return value.toUpperCase().includes(filter.value.toUpperCase());
                }
            }
            if(filter.type=='elements'){                
                return (value==filter.value);
            }
            if(filter.type=='group'){
                return value.split(',').includes(filter.value);
            }
            if(filter.type=='date'){
                let valueDate=new Date(value);
                let filterDate=new Date(filter.value);
                return eval(valueDate.getTime()+" "+filter.eval+" "+filterDate.getTime())
            }
            if(filter.type=='number'){
                if(!isNaN(filter.value))
                    return eval(value+" "+filter.eval+" "+filter.value);
                return false;
            }
            return false;
        },        
        getImageToShow(row, image){
            let value=row[image.col]+"";
            return eval(value+image.eval+image.value);            
        }
    },
    data(){
        return {
            sizes: {
                height:300,
                top: parseInt(this.margintop),
                bottom: 10
            },
            current: 1,
            init: false,
            filterArray: {},
            filterData: []                
        }
    }
    
});

Vue.component('chis-filter', {
    props: {
        filters: {
            type: Array,
            required: true
        }
    },
    template:`
        <thead>
            <tr v-for="row in filters">
                <td v-for="fcell in row">
                    <input v-if="fcell.type && (fcell.type=='text' || fcell.type=='number')" class="form-control" :class="{'text-right': fcell.type=='number'}" :id="fcell.name" type="text" @input="changeInput(fcell,$event.target.value)"/>
                    <input v-if="fcell.type && fcell.type=='date'" class="form-control w-auto text-right" :value="fcell.default" :id="fcell.name" type="date" @input="changeInput(fcell,$event.target.value)"/>
                    <select v-if="fcell.type && fcell.type=='elements'" class="custom-select" :id="fcell.name" @change="changeInput(fcell,$event.target.value)">
                        <option v-for="elem in fcell.elements" :value="elem.value" :selected="fcell.default==elem.value">{{ elem.text }}</option>
                    </select>
                    <select v-if="fcell.type && fcell.type=='group'" class="custom-select" :id="fcell.name" @change="changeInput(fcell,$event.target.value)">
                        <option v-for="elem in fcell.elements" :value="elem.value" :selected="fcell.default==elem.value">{{ elem.text }}</option>
                    </select>
                </td>
            </tr>    
        </thead>
    `,        
    methods: {        
        changeInput(fcell, value){
            this.$emit('chis-filter-change',fcell.name, fcell.type, fcell.col, fcell.eval, value);
        }                          
    }
})

Vue.component('chis-cell', {
    props: ['cellval','cellclass'],
    template: `
        <td :class="cellclass" :title="cellval">{{ cellval }}</td>
    `
});

Vue.component('chis-cell-button', {
    //props: ['bobj','baction','bclass','bimage','btitle'],
    props: {
        bobj:{
            type: Object,
            required: false,
            default: () => {}
        },
        baction:{
            type: Number,
            required: true,
        },
        bclass:{
            type: String,
            required: false,
            default: ''
        },
        bimage:{
            type: String,
            required: false,
        },
        btitle:{
            type: String,
            required: false,
            default: ''
        },
    },
    template:`
        <span>
            <img v-if="baction!=0" :class="bclass" class="btn-img ml-2" :src="bimage" :title="btitle" @click="actionClickHandler"/> 
            <span class="border-left ml-1 mr-1" v-if="baction==0"></span>
        </span>
    `,
    methods:{
        actionClickHandler(event){                        
            this.$emit('chis-action-click',this.baction,this.bobj,event);
        }
    }
});

Vue.component('chis-paginator', {
    props: ['current','total','resultsForPage','cols'],
    template: `
        <td :colspan="cols" class="text-center">
            <ul class="pagination justify-content-center" v-show="getNumPages>1">
                <li class="page-item" :class="{disabled: current==1}" @click="setPageHandler(1)"><a class="page-link" href="#">First</a></li>
                <li class="page-item" :class="{disabled: current==1}" @click="previousPageHandler(1)"><a class="page-link" href="#"><<</a></li> 
                <li v-for="n in getTotalPages" class="page-item" :class="{active: current==(n+startPage)}" @click="changePageHandler((n+startPage))">
                    <span style="cursor:pointer" class="page-link" href="#" >{{ (n+startPage) }}</span>
                </li>
                <li class="page-item" :class="{disabled: current==getNumPages}"><a class="page-link" href="#" @click="nextPageHandler()">>></a></li>
                <li class="page-item" :class="{disabled: current==getNumPages}"><a class="page-link" href="#" @click="setPageHandler(getNumPages)">Last</a></li>
            </ul>
        </td>
    `,
    computed: {
        getNumPages(){
            let num=Math.ceil(this.total/this.resultsForPage);                                  
            return num;
        },
        startPage(){
            if(this.getNumPages>this.numPages){
                let half=Math.ceil(this.numPages/2);                            
                let start=this.current-half;
                let end=this.current+half;                            
                if(start<1) start=0;
                if(end>this.getNumPages) start=this.getNumPages-this.numPages;                                                        
                return start;
            }           
            return 0;
        },
        getTotalPages(){
            if(this.getNumPages<this.numPages)
                return this.getNumPages;
            return this.numPages;
        }
    },
    data(){
        return {
            numPages: 9                                               
        }
    },
    methods:{
        setPageHandler(page){
            this.changePageHandler(page);
        },
        previousPageHandler(){
            let num=this.current-1;
            this.changePageHandler(num);
        },
        nextPageHandler(){
            let num=this.current+1;
            this.changePageHandler(num);
        },
        changePageHandler(page){
            this.$emit('chis-page-change',page);
        }
    }
})

Vue.component('chis-image', {
    props:{
        bimage:{
            type: String,
            required: true,
        },
        btitle:{
            type: String
        }
    },
    template:`
        <span>
            <img class="btn-inf" :src="bimage" :title="btitle"/>
        </span>
    `,
})


