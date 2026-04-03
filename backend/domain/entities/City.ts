export class City {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly image: string, // 가공된 url
  ) {}
}

