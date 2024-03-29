import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { OwnerAlreadyExistsError } from './errors/owner-alredy-exists-error'
import { Owner } from '../../enterprise/entities/owner'
import { OwnersRepository } from '../repositories/owner-repository'

interface RegisterOwnerUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterOwnerUseCaseResponse = Either<
  OwnerAlreadyExistsError,
  {
    owner: Owner
  }
>

@Injectable()
export class RegisterOwnerUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterOwnerUseCaseRequest): Promise<RegisterOwnerUseCaseResponse> {
    const ownerWithSameEmail = await this.ownersRepository.findByEmail(email)

    if (ownerWithSameEmail) {
      return left(new OwnerAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const owner = Owner.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.ownersRepository.create(owner)

    return right({
      owner,
    })
  }
}
