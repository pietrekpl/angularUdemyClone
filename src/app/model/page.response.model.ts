export interface PageResponse<DTO> {
  content: DTO[],
  number: number,
  totalPages:number,
  size:number
}
