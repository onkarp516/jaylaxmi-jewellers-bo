import { savePDF } from "@progress/kendo-react-pdf";

class DocService {
  createPdf = (html, filename) => {
    savePDF(html, {
      paperSize: "A4",
      fileName: `${filename}.pdf`,
      margin: 1,
    });
  };
}

const Doc = new DocService();
export default Doc;
