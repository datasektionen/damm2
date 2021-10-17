import styled from '@emotion/styled'
import Theme from '../../../../common/Theme';

export const StyledEventTable = styled.div({
    margin: "20px 0",
})

export const ListHead = styled.div({
    display: "grid",
    gridTemplateColumns: "50px 1fr 1fr 1fr 1fr auto",
    width: "100%",
    borderBottom: "solid 2px #ddd",
    padding: "0px 10px",
})

export const HeadItem = styled.div({
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    "> i": {
        fontSize: "1.2em",
        padding: "10px",
        cursor: "pointer"
    }
},
    (props: any) => ({
        "> i": {
            transform: props.direction === "desc" ? "rotate(0deg)" : "rotate(180deg)"
        }
    })
)

export const ListItem = styled.div({

},
    (props: any) => {
        let color = "#818181";
        if (props.type === "GENERAL") color = Theme.palette.cerise
        else if (props.type === "ANNIVERSARY") color = Theme.palette.yellow
        else if (props.type === "SM_DM") color = Theme.palette.blue

        return {
            color,
            fontWeight: props.type ? "bold" : "initial"
        }
    }
)

export const ListContent = styled.div({
    
})

export const ListEntry = styled.div({
    display: "grid",
    gridTemplateColumns: "50px 1fr 1fr 1fr 1fr auto",
    width: "100%",
    padding: "6px 10px",
},
    (props: any) => ({
        backgroundColor: props.index % 2 === 0 ? "#fff" : "#eee"
    })
)

export const EditButton = styled.i({
    color: "#333",
},
    (props: any) => ({
        cursor: props.disabled ? "initial" : "pointer",
        ":hover": {
            transform: props.disabled ? "scale(1)" : "scale(1.2)"
        }
    })
)

export const TrashButton = styled(EditButton)({
    paddingLeft: "5px"
})