module.exports = {
    render(templateName, model) {
        templateName = templateName + 'Template';
        let templateElement = document.getElementById(templateName).textContent,
            renderFn = Handlebars.compile(templateElement);
        return renderFn(model);
    }
};