import { Equipe } from 'src/equipe/entities/equipe.entity';
import { ChildEntity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Partida } from './partida.entity';

@ChildEntity()
export class PartidaEquipe extends Partida {
  @ManyToMany(() => Equipe, {
    eager: true,
  })
  @JoinTable({ name: 'equipes_por_partida' })
  equipes: Equipe[];

  @ManyToOne(() => Equipe, {
    eager: true,
  })
  vencedor: Equipe;
}
