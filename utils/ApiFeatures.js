class ApiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    

    filter(){
        const queryObj = {...this.queryString};
        const keywords = ['sort', 'page', 'fields', 'limit'];
        keywords.forEach(cur => delete queryObj[cur]);
        console.log(queryObj);
        
        //ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
        queryStr = JSON.parse(queryStr);
        this.query.find(queryStr);

        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortValue = this.queryString.sort.split(',').join(' ');
            this.query.sort(sortValue);
        }
        else{
            this.query.sort('-createAt');
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 5;
        const skip = (page-1) * limit;
        this.query.skip(skip).limit(limit)
        return this;
    }

    fieldValues(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(`${fields}`);
        }
        else{
            this.query = this.query.select('-__v');
        }
        return this;
    }
}

module.exports = ApiFeatures