function SandBox(allowProps, denyProps) {
    ///<param name="allowProps" type="Array"></param>
    ///<param name="denyProps" type="Array"></param>

    if (!(this instanceof SandBox)) {
        return new SandBox(denyProps, allowProps);
    }

    // Helper functions.

    function mergeArray(targetArray, toAppendArray) {
        ///<param name="targetArray" type="Array"></param>
        ///<param name="toAppendArray" type="Array"></param>
        for (var i = 0; i < toAppendArray.length; i++) {
            var item = toAppendArray[i];
            if (targetArray.indexOf(item) == -1) targetArray.push(item);
        }
    }
    function filterArray(targetArray, toRemoveArray) {
        ///<param name="targetArray" type="Array"></param>
        ///<param name="toRemoveArray" type="Array"></param>
        var result = [];
        for (var i = 0; i < targetArray.length; i++) {
            var item = targetArray[i];
            if (toRemoveArray.indexOf(item) == -1) result.push(item);
        }
        return result;
    }

    denyProps = denyProps || [];
    allowProps = allowProps || [];
    defaultDenyProps = filterArray(['window', 'Function', 'eval', 'ActiveXObject', 'XMLHttpRequest'], allowProps);
    mergeArray(denyProps, defaultDenyProps);
    var reserved = "abstract,boolean,break,byte,case,catch,char,class,const,continue,debugger,default,delete,do,double,else,enum,export,extends,false,final,finally,float,for,function,goto,if,implements,import,in,instanceof,int,interface,long,native,new,null,package,private,protected,public,return,short,static,super,switch,synchronized,this,throw,throws,transient,true,try,typeof,var,volatile,void,while,with".split(',');

    var sandboxArgs = [];
    for (var prop in window) {
        if (denyProps.indexOf(prop) != -1) continue;
        if (allowProps.indexOf(prop) != -1) continue;
        if (reserved.indexOf(prop) != -1) continue;
        if (prop.match(/^[a-z\$_][a-z\$_0-9]*$/i) == null) continue;
        sandboxArgs.push(prop);
    }
    for (var i = 0; i < denyProps.length; i++) sandboxArgs.push(denyProps[i]);
    sandboxArgs = sandboxArgs.join(',');

    this.Run = function (javaScriptCode) {
        ///<param name="javaScriptCode" type="String"></param>
        Function(sandboxArgs, javaScriptCode).apply({}, []);
    }
}