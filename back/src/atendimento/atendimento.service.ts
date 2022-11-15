import { RecordNotFoundException } from '@exceptions';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateAtendimentoDto } from './dto/create-atendimento.dto';
import { UpdateAtendimentoDto } from './dto/update-atendimento.dto';
import { Atendimento } from './entities/atendimento.entity';

@Injectable()
export class AtendimentoService {
  constructor(
    @InjectRepository(Atendimento) private repository: Repository<Atendimento>,
  ) {}

  create(createAtendimentoDto: CreateAtendimentoDto): Promise<Atendimento> {
    const atendimento: Atendimento =
      this.repository.create(createAtendimentoDto);
    atendimento.status = "Em Aberto";
    return this.repository.save(atendimento);
  }

  async findAll(
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<Atendimento>> {
    const where: FindManyOptions<Atendimento> = {};
    if (search) {
      where.where = [
        { descricao: ILike(`%${search}%`) },
        { jogador: ILike(`%${search}%`) },
        { funcionario: ILike(`%${search}%`) },
      ];
    }

    return paginate<Atendimento>(this.repository, options, where);
  }

  async findOne(id: number): Promise<Atendimento> {
    const atendimento = await this.repository.findOneBy({ id });

    if (!atendimento) {
      throw new RecordNotFoundException();
    }

    return atendimento;
  }

  async update(
    id: number,
    updateAtendimentoDto: UpdateAtendimentoDto,
  ): Promise<Atendimento> {
    await this.repository.update(id, updateAtendimentoDto);
    const atendimento = await this.repository.findOneBy({ id });
    if (!atendimento) {
      throw new RecordNotFoundException();
    }
    return atendimento;
  }

  async remove(id: number) {
    const atendimento = await this.repository.findOneBy({ id });
    if (!atendimento) {
      throw new RecordNotFoundException();
    }

    return this.repository.delete(id);
  }
}
