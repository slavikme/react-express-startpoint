export interface TemplateVariablesInterface {
    [key: string]: string | Function;
}

export interface TemplateObjectInterface {
    templates: string[];
    variables: TemplateVariablesInterface;
}

export const fillTemplatesVars = (templateObject: TemplateObjectInterface) => {
    const variables: TemplateVariablesInterface = {};
    const templates = templateObject.templates.map(template => template.replace(
        /\$\{(?:\s*(\w+)\s*=\s*)?(\w+)(?:\((.*)\))?\s*}/g,
        (_, assign: string, variable: string, args?: string) => {
            const argsArr = args ? args.split(',').map(arg => arg.replace(/^\s*|\s*$/g, '')) : [];

            if (templateObject.variables.hasOwnProperty(variable)) {
                const value = templateObject.variables[variable];
                const replacer = typeof value === 'function' ? value.apply(null, argsArr) : value;

                if (assign)
                    variables[assign] = replacer;

                return replacer;
            }

            return _;
        })
    );

    return {templates, variables};
};