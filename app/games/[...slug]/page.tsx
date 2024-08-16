class QueryParam {
  field: String;
  value: String;
  constructor(field: string, value?: string) {
    this.field = field;
    this.value = value ? value : "";
  }
}

function slugToAPI(param: QueryParam) {
  switch (param.field) {
    case "genres":
      return;
  }
}

const GamesFunPage = async ({ params }: { params: { slug: string[] } }) => {
  const slugs = params.slug;
  const Params = [];

  for (let i = 0; i < slugs.length; i++) {
    // odds
    if (i % 2) {
      Params[Math.floor(i / 2)].value = slugs[i];
    } else {
      Params.push(new QueryParam(slugs[i]));
    }
  }

  for (const param of Params) {
    console.log(`${param.field}: ${param.value}`);
  }

  return (
    <div className="min-h-screen w-full h-full py-24 text-center">
      Slug city baby
    </div>
  );
};

export default GamesFunPage;
