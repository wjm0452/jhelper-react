import httpClient from "../../../common/httpClient";

type UploadType = {
  file: File;
  uploadUrl: string;
  params?: any;
};

export const uploadFile = async ({ file, uploadUrl, params }: UploadType) => {
  if (!file) {
    throw "선택된 파일이 없습니다.";
  }

  let formData = new FormData(); // formData 객체를 생성한다.
  formData.append("file", file);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      formData.append(k, v.toString());
    }
  }

  return httpClient
    .request({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: uploadUrl,
      method: "POST",
      data: formData,
    })
    .then((res: any) => {
      return res.data;
    });
};
