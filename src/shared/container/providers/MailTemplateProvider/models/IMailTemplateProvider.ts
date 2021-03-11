import ParseMailTemplateDTO from '../dtos/ParseMailTemplateDTO';

export default interface IMailTemplateProvider {
    parse(data: ParseMailTemplateDTO): Promise<string>;
}
