function fitObject(obj, w, h) {
    const kw = obj.width / w;
    const kh = obj.height / h;

    let k = 1;

    k = Math.max(kw, kh);
    
    obj.width /= k;
    obj.height /= k;
}

export default fitObject;