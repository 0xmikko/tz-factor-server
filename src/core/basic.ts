
// Basic Interfaces
export interface BasicRepositoryI<T> {

    findOne(id : string) : Promise<T | undefined>
    list() : Promise<T[] | undefined>
}

export interface BasicCRUDService<T> {

}
