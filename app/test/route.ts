import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://movibox.net/wefeed-h5api-bff/subject/play?subjectId=6054067985336206408&se=0&ep=0&detailPath=the-wild-robot-atWOoT7Hdd7&streamSignType=0",
      {
        headers: {
          Accept: "application/json",
          Cookie:
            "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzOTMxMDYxNDM2MjA1NzU2MCwiYXRwIjozLCJleHQiOiIxNzg1Mzk2MjEyIiwiZXhwIjoxNzkzMTcyMjEyLCJpYXQiOjE3ODUzOTU5MTJ9.6QNhfIokgUl7xhJLir7tEDOwWeo2DQ7bmokL4xbZAhM; mb_token=%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjYyNzc1MTE4MTQ3NjIxOTI3ODQsImF0cCI6MywiZXh0IjoiMTc4NTM5NjI3MSIsImV4cCI6MTc5MzE3MjI3MSwiaWF0IjoxNzg1Mzk1OTcxfQ.HB1iqXOssFayG3gBeFYifLbXufwxmyZPFxieF9co1i8%22; i18n_lang=en",
          Referer:
            "https://movibox.net/movies/the-wild-robot-atWOoT7Hdd7?id=6054067985336206408&type=/movie/detail&detailSe=&detailEp=&lang=en",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
          "x-client-info": '{"timezone":"Asia/Manila"}',
          "x-source": "",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
