export interface Activity {

  id: string;

  actividad: string;

  frase: string;

  mes: string;

  fotoURL: string;

  fotoSubidaURL: string | null;

  isRealizada: boolean;

  fechaRealizacion: Date | null;

}