
// Basic Interfaces

export interface BasicRepositoryI<T> {

    insert(newItem: T) : Promise<string | undefined>
    findOne(id : string) : Promise<T | undefined>
    list() : Promise<T[] | undefined>
}

export interface BasicCRUDService<T> {

}
