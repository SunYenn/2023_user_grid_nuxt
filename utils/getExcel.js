export function excelDown(res) {
    const filename = getFilename(res.headers['content-disposition']);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
}

export function getFilename(contentDisposition) {
    const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = regex.exec(contentDisposition);
    if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
    }
    return null;
}