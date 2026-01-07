import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'; 
import { VoituresService } from './voitures.service';
import { CreateVoitureDto } from 'src/dto/create-voiture.dto';
import { UpdateVoitureDto } from 'src/dto/update-voiture.dto';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class VoituresGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly voitureService: VoituresService) {}


  
  // CREATE
  @SubscribeMessage('voiture:create')
  async create(@MessageBody() dto: CreateVoitureDto) {
    const voiture = await this.voitureService.create(dto);
    this.server.emit('voiture:created', voiture);
    return voiture;
  }

  // READ ALL
@SubscribeMessage('voiture:findAll')
async findAll() {
  const voitures = await this.voitureService.findAll();
  this.server.emit('voiture:findAllResult', voitures);
}


  // READ ONE
  @SubscribeMessage('voiture:findOne')
  async findOne(@MessageBody() id: string) {
    return this.voitureService.findOne(id);
  }

  // UPDATE
  @SubscribeMessage('voiture:update')
  async update(
    @MessageBody()
    payload: { id: string; data: UpdateVoitureDto },
  ) {
    const voiture = await this.voitureService.update(
      payload.id,
      payload.data,
    );
    this.server.emit('voiture:updated', voiture);
    return voiture;
  }

  // DELETE
  @SubscribeMessage('voiture:delete')
  async remove(@MessageBody() id: string) {
    await this.voitureService.remove(id);
    this.server.emit('voiture:deleted', id);
    return { deleted: true };
  }
}
